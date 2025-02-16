import type { Database } from './supabase';

export type NotificationType = 
  | 'follow'
  | 'like'
  | 'reply'
  | 'mention'
  | 'message'
  | 'project_request'
  | 'project_invite'
  | 'project_update'
  | 'task_assigned'
  | 'task_completed'
  | 'milestone_reached'
  | 'deadline_approaching'
  | 'system_announcement';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Notification = Database['public']['Tables']['notifications']['Row'];

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export interface NotificationProps {
  notification: Notification;
  onRead?: (id: number) => void;
  onArchive?: (id: number) => void;
  onAction?: (notificationId: number, action: string) => void;
}
