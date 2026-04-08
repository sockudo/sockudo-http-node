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
