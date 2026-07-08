'use client';
// Work & Deliverables board. Staff and clients render the same
// data; staff additionally get inline editing (status, visibility,
// add/delete) so keeping the board current takes seconds.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useClientScope } from '../../portal/ClientScope';
import { useAuth } from '../../context/AuthProvider';
import {
  subscribeTasks, createTask, updateTask, deleteTask,
  subscribeComments, addComment, formatDate,
  monthKeyOf, monthLabel,
} from '../../portal/portalService';
import {
  TASK_STATUS, TASK_STATUS_LABELS, VISIBILITY,
} from '../../portal/portalConstants';
import styles from './PortalWork.module.css';

const ACTIVE_GROUPS = [
  { status: TASK_STATUS.IN_REVIEW,   heading: 'Waiting on your review' },
  { status: TASK_STATUS.IN_PROGRESS, heading: 'In progress now' },
  { status: TASK_STATUS.NOT_STARTED, heading: 'Queued next' },
  { status: TASK_STATUS.BLOCKED,     heading: 'Blocked' },
];

export default function PortalWork() {
  const { clientId, isStaffView } = useClientScope();
  const { role } = useAuth();
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    if (!clientId || !role) return undefined;
    return subscribeTasks(clientId, role, setTasks);
  }, [clientId, role]);

  if (!clientId) {
    return (
      <div className={styles.empty}>
        <div className="eyebrow">work</div>
        <h1 className={styles.title}>No client selected</h1>
        <p className={styles.emptyText}>
          <Link className={styles.link} href="/portal/admin">Choose a client</Link> to see their board.
        </p>
      </div>
    );
  }

  const rows = tasks || [];
  const thisMonth = monthKeyOf();

  // Done tasks grouped by month, newest month first.
  const shippedByMonth = new Map();
  rows.filter((t) => t.status === TASK_STATUS.DONE).forEach((t) => {
    const key = t.month || 'earlier';
    if (!shippedByMonth.has(key)) shippedByMonth.set(key, []);
    shippedByMonth.get(key).push(t);
  });
  const shippedMonths = [...shippedByMonth.keys()].sort().reverse();

  return (
    <div className={styles.work}>
      <header>
        <div className="eyebrow">work &amp; deliverables</div>
        <h1 className={styles.title}>What we are working on</h1>
        <p className={styles.sub}>
          Everything shipped, in motion, and queued for your engagement. Items marked
          for review have a draft linked and ready for your eyes.
        </p>
      </header>

      {isStaffView && <AddTaskForm clientId={clientId} />}

      {tasks === null && <div className={styles.loading}>// loading…</div>}

      {ACTIVE_GROUPS.map(({ status, heading }) => {
        const group = rows.filter((t) => t.status === status);
        if (group.length === 0) return null;
        return (
          <section key={status} className={styles.group}>
            <h2 className={styles.groupHeading}>
              {heading} <span className={styles.count}>{group.length}</span>
            </h2>
            <ul className={styles.list}>
              {group.map((t) => (
                <TaskRow key={t.id} task={t} clientId={clientId} isStaffView={isStaffView} />
              ))}
            </ul>
          </section>
        );
      })}

      {shippedMonths.map((key) => (
        <section key={key} className={styles.group}>
          <h2 className={styles.groupHeading}>
            {key === thisMonth ? 'Shipped this month' : `Shipped in ${monthLabel(key)}`}
            <span className={styles.count}>{shippedByMonth.get(key).length}</span>
          </h2>
          <ul className={styles.list}>
            {shippedByMonth.get(key).map((t) => (
              <TaskRow key={t.id} task={t} clientId={clientId} isStaffView={isStaffView} />
            ))}
          </ul>
        </section>
      ))}

      {tasks !== null && rows.length === 0 && (
        <p className={styles.emptyText}>Nothing here yet. Work items will appear as the engagement kicks off.</p>
      )}
    </div>
  );
}

function TaskRow({ task, clientId, isStaffView }) {
  const approval = task.approvalStatus;
  const [showComments, setShowComments] = useState(false);
  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <div className={styles.rowTitleLine}>
          <span className={styles.rowTitle}>{task.title}</span>
          <span className={task.type === 'deliverable' ? styles.typeDeliverable : styles.typeTask}>
            {task.type === 'deliverable' ? 'Deliverable' : 'Task'}
          </span>
          {isStaffView && task.visibility === VISIBILITY.INTERNAL && (
            <span className={styles.internalBadge}>Internal</span>
          )}
          {approval === 'pending' && <span className={styles.approvalPending}>Review requested</span>}
          {approval === 'approved' && <span className={styles.approvalDone}>Approved</span>}
          {approval === 'changes_requested' && (
            <span className={styles.approvalChanges}>Changes requested</span>
          )}
        </div>
        {task.description && <p className={styles.rowDesc}>{task.description}</p>}
        {task.links && task.links.length > 0 && (
          <div className={styles.links}>
            {task.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {l.label || 'Open link'} ↗
              </a>
            ))}
          </div>
        )}
        <button
          className={styles.commentToggle}
          type="button"
          onClick={() => setShowComments((s) => !s)}
        >
          {showComments ? 'Hide comments' : 'Comments'}
        </button>
        {showComments && (
          <CommentThread task={task} clientId={clientId} isStaffView={isStaffView} />
        )}
      </div>

      <div className={styles.rowSide}>
        {task.month && <span className={styles.monthChip}>{monthLabel(task.month)}</span>}
        {isStaffView ? <StaffControls task={task} clientId={clientId} /> : (
          <span className={styles.statusChip}>{TASK_STATUS_LABELS[task.status] || task.status}</span>
        )}
      </div>
    </li>
  );
}

function CommentThread({ task, clientId, isStaffView }) {
  const { user, profile, role } = useAuth();
  const [comments, setComments] = useState(null);
  const [body, setBody] = useState('');
  const [internal, setInternal] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!role) return undefined;
    return subscribeComments(clientId, task.id, role, setComments);
  }, [clientId, task.id, role]);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await addComment(clientId, task.id, {
        body: body.trim(),
        author: {
          uid: user.uid,
          displayName: profile && profile.displayName,
          email: user.email,
          role,
        },
        visibility: isStaffView && internal ? VISIBILITY.INTERNAL : VISIBILITY.CLIENT,
      });
      setBody('');
      setInternal(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.thread}>
      {comments === null && <div className={styles.threadLoading}>Loading comments…</div>}
      {comments !== null && comments.length === 0 && (
        <div className={styles.threadLoading}>No comments yet. Start the conversation.</div>
      )}
      {comments !== null && comments.map((c) => (
        <div key={c.id} className={styles.comment}>
          <div className={styles.commentMeta}>
            <span className={c.authorRole === 'staff' ? styles.authorStaff : styles.authorClient}>
              {c.authorName}
            </span>
            {c.visibility === VISIBILITY.INTERNAL && (
              <span className={styles.internalBadge}>Internal</span>
            )}
            {c.createdAt && <span className={styles.commentDate}>{formatDate(c.createdAt)}</span>}
          </div>
          <p className={styles.commentBody}>{c.body}</p>
        </div>
      ))}

      <form className={styles.commentForm} onSubmit={submit}>
        <input
          className={styles.input}
          placeholder="Write a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {isStaffView && (
          <label className={styles.internalCheck}>
            <input
              type="checkbox"
              checked={internal}
              onChange={(e) => setInternal(e.target.checked)}
            />
            Internal note
          </label>
        )}
        <button className={styles.addBtn} type="submit" disabled={busy || !body.trim()}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </form>
    </div>
  );
}

function StaffControls({ task, clientId }) {
  const setStatus = (status) => updateTask(clientId, task.id, {
    status,
    shippedAt: status === TASK_STATUS.DONE ? new Date() : null,
    month: status === TASK_STATUS.DONE ? monthKeyOf() : task.month,
  });
  const toggleVisibility = () => updateTask(clientId, task.id, {
    visibility: task.visibility === VISIBILITY.INTERNAL ? VISIBILITY.CLIENT : VISIBILITY.INTERNAL,
  });
  const remove = () => {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask(clientId, task.id);
    }
  };

  return (
    <div className={styles.controls}>
      <select
        className={styles.select}
        value={task.status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label={`Status for ${task.title}`}
      >
        {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <button
        className={styles.ctrlBtn}
        type="button"
        onClick={toggleVisibility}
        title="Toggle client visibility"
      >
        {task.visibility === VISIBILITY.INTERNAL ? 'Show to client' : 'Make internal'}
      </button>
      <button className={styles.ctrlBtnDanger} type="button" onClick={remove}>
        Delete
      </button>
    </div>
  );
}

function AddTaskForm({ clientId }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('task');
  const [status, setStatus] = useState(TASK_STATUS.NOT_STARTED);
  const [visibility, setVisibility] = useState(VISIBILITY.CLIENT);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await createTask(clientId, {
        title: title.trim(),
        type, status, visibility,
        month: monthKeyOf(),
        links: linkUrl.trim()
          ? [{ label: linkLabel.trim() || 'Open link', url: linkUrl.trim() }]
          : [],
        shippedAt: status === TASK_STATUS.DONE ? new Date() : null,
      });
      setTitle(''); setLinkUrl(''); setLinkLabel('');
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button className={styles.addToggle} type="button" onClick={() => setOpen(true)}>
        + Add work item
      </button>
    );
  }

  return (
    <form className={styles.addForm} onSubmit={submit}>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="What are you working on?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="task">Task</option>
          <option value="deliverable">Deliverable</option>
        </select>
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select className={styles.select} value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value={VISIBILITY.CLIENT}>Client sees it</option>
          <option value={VISIBILITY.INTERNAL}>Internal only</option>
        </select>
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Link URL (optional: Drive doc, live page…)"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Link label"
          value={linkLabel}
          onChange={(e) => setLinkLabel(e.target.value)}
        />
        <button className={styles.addBtn} type="submit" disabled={busy}>
          {busy ? 'Adding…' : 'Add'}
        </button>
        <button className={styles.ctrlBtn} type="button" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </form>
  );
}
