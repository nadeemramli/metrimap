// Client access layer for the Events Taxonomy — a governed dictionary of
// product/business events and their properties (Data hub "Events" tab). v1 is
// catalog-only; RLS scopes rows to the owner (see the event_taxonomy migration).

import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveClient } from '@/shared/utils/authenticatedClient';
import type { Database, Json } from '../types';

type Client = SupabaseClient<Database>;

export type EventLifecycle = 'proposed' | 'approved' | 'deprecated';
export type EventPropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'timestamp'
  | 'enum';

export interface EventDefinition {
  id: string;
  name: string;
  key: string;
  category: string | null;
  description: string | null;
  lifecycle_state: EventLifecycle;
  source_kind: string | null;
  owner_label: string | null;
  tracked_metric_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventProperty {
  id: string;
  event_id: string;
  name: string;
  key: string;
  data_type: EventPropertyType;
  required: boolean;
  allowed_values: Json | null;
  example_value: string | null;
  description: string | null;
}

export interface EventDefinitionInput {
  name: string;
  key: string;
  category?: string | null;
  description?: string | null;
  lifecycle_state?: EventLifecycle;
  source_kind?: string | null;
  owner_label?: string | null;
}

export interface EventPropertyInput {
  event_id: string;
  name: string;
  key: string;
  data_type?: EventPropertyType;
  required?: boolean;
  allowed_values?: Json | null;
  example_value?: string | null;
  description?: string | null;
}

const EVENT_COLS =
  'id, name, key, category, description, lifecycle_state, source_kind, owner_label, tracked_metric_id, created_at, updated_at';
const PROPERTY_COLS =
  'id, event_id, name, key, data_type, required, allowed_values, example_value, description';

/** List the caller's event definitions, newest first. */
export async function listEvents(
  authenticatedClient?: Client
): Promise<EventDefinition[]> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('event_definitions')
    .select(EVENT_COLS)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as EventDefinition[];
}

export async function createEvent(
  input: EventDefinitionInput,
  authenticatedClient?: Client
): Promise<EventDefinition> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('event_definitions')
    .insert(input)
    .select(EVENT_COLS)
    .single();
  if (error) throw new Error(error.message);
  return data as EventDefinition;
}

export async function updateEvent(
  id: string,
  patch: Partial<EventDefinitionInput>,
  authenticatedClient?: Client
): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('event_definitions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteEvent(
  id: string,
  authenticatedClient?: Client
): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client
    .from('event_definitions')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/** List properties for an event definition. */
export async function listProperties(
  eventId: string,
  authenticatedClient?: Client
): Promise<EventProperty[]> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('event_properties')
    .select(PROPERTY_COLS)
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as EventProperty[];
}

export async function upsertProperty(
  input: EventPropertyInput & { id?: string },
  authenticatedClient?: Client
): Promise<EventProperty> {
  const client = resolveClient(authenticatedClient);
  const { data, error } = await client
    .from('event_properties')
    .upsert(input)
    .select(PROPERTY_COLS)
    .single();
  if (error) throw new Error(error.message);
  return data as EventProperty;
}

export async function deleteProperty(
  id: string,
  authenticatedClient?: Client
): Promise<void> {
  const client = resolveClient(authenticatedClient);
  const { error } = await client.from('event_properties').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
