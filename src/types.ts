import type { Agent } from "http";
import type { Response } from "node-fetch";

export interface BaseOptions {
  appId: string | number;
  key: string;
  secret: string;
  port?: string | number;
  useTLS?: boolean;
  encrypted?: boolean;
  timeout?: number;
  agent?: Agent;
  encryptionMasterKey?: string;
  encryptionMasterKeyBase64?: string;
  autoIdempotencyKey?: boolean;
  maxRetries?: number;
  scheme?: string;
}

export interface ClusterOptions extends BaseOptions {
  cluster: string;
}

export interface HostOptions extends BaseOptions {
  host: string;
  port?: string | number;
}

export type Options = ClusterOptions | HostOptions;

export type IdempotencyKey = string | true;

export interface TriggerParams {
  socket_id?: string;
  info?: string;
  idempotency_key?: IdempotencyKey;
}

export interface BatchEvent extends TriggerParams {
  channel: string;
  name: string;
  data: unknown;
}

export interface RequestParams {
  [key: string]: unknown;
}

export interface RequestOptions {
  path: string;
  params?: RequestParams;
  headers?: Record<string, string>;
}

export interface GetOptions extends RequestOptions {}

export interface HistoryParams extends RequestParams {
  limit?: number;
  direction?: string;
  cursor?: string;
  start_serial?: number;
  end_serial?: number;
  start_time_ms?: number;
  end_time_ms?: number;
}

export type HistoryDirection = "newest_first" | "oldest_first";

export interface PresenceHistoryParams extends HistoryParams {
  direction?: HistoryDirection;
  /** Ably-compatible alias for start_time_ms */
  start?: number;
  /** Ably-compatible alias for end_time_ms */
  end?: number;
}

export type PresenceHistoryEventKind = "member_added" | "member_removed";
export type PresenceHistoryEventCause =
  | "join"
  | "disconnect"
  | "orphan_cleanup"
  | "timeout"
  | "forced_disconnect";

export interface PresenceHistoryEventPayload {
  stream_id: string;
  serial: number;
  published_at_ms: number;
  event: PresenceHistoryEventKind;
  cause: PresenceHistoryEventCause;
  user_id: string;
  connection_id?: string | null;
  user_info?: Record<string, unknown> | null;
  dead_node_id?: string | null;
}

export interface PresenceHistoryItem {
  stream_id: string;
  serial: number;
  published_at_ms: number;
  event: PresenceHistoryEventKind;
  cause: PresenceHistoryEventCause;
  user_id: string;
  connection_id?: string | null;
  dead_node_id?: string | null;
  payload_size_bytes: number;
  presence_event: PresenceHistoryEventPayload;
}

export interface PresenceHistoryBounds {
  start_serial?: number | null;
  end_serial?: number | null;
  start_time_ms?: number | null;
  end_time_ms?: number | null;
}

export interface PresenceHistoryContinuity {
  stream_id?: string | null;
  oldest_available_serial?: number | null;
  newest_available_serial?: number | null;
  oldest_available_published_at_ms?: number | null;
  newest_available_published_at_ms?: number | null;
  retained_events: number;
  retained_bytes: number;
  degraded: boolean;
  complete: boolean;
  truncated_by_retention: boolean;
}

export interface PresenceHistoryPage {
  items: PresenceHistoryItem[];
  direction: HistoryDirection;
  limit: number;
  has_more: boolean;
  next_cursor?: string | null;
  bounds: PresenceHistoryBounds;
  continuity: PresenceHistoryContinuity;
}

export interface PresenceSnapshotParams extends RequestParams {
  at_time_ms?: number;
  /** Ably-compatible alias for at_time_ms */
  at?: number;
  at_serial?: number;
}

export interface PresenceSnapshotMember {
  user_id: string;
  last_event: PresenceHistoryEventKind;
  last_event_serial: number;
  last_event_at_ms: number;
}

export interface PresenceSnapshot {
  channel: string;
  members: PresenceSnapshotMember[];
  member_count: number;
  events_replayed: number;
  snapshot_serial?: number | null;
  snapshot_time_ms?: number | null;
  continuity: PresenceHistoryContinuity;
}

export interface PostOptions extends RequestOptions {
  body: unknown;
}

export interface SignedQueryStringOptions {
  method: string;
  path: string;
  body?: string;
  params?: RequestParams;
}

export interface ChannelAuthResponse {
  auth: string;
  channel_data?: string;
  shared_secret?: string;
}

export interface UserAuthResponse {
  auth: string;
  user_data: string;
}

export interface PresenceChannelData {
  user_id: string;
  user_info?: Record<string, unknown>;
}

export interface UserChannelData {
  id: string;
  [key: string]: unknown;
}

export interface WebHookRequest {
  headers: Record<string, string | undefined>;
  rawBody: string;
}

export interface WebHookEvent {
  name: string;
  channel: string;
  event: string;
  data: string;
  socket_id: string;
}

export interface WebHookData {
  time_ms: number;
  events: WebHookEvent[];
}

export interface TokenShape {
  key: string;
  secret: string;
}

export type ResponseWithIdempotency = Response & {
  idempotencyKey?: IdempotencyKey;
  idempotencyKeys?: IdempotencyKey[];
};

export interface SignedRequest {
  method: string;
  path: string;
  params?: RequestParams;
  body?: string;
}
