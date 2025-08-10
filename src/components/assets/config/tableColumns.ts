interface Column {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
}

export const METRIC_COLUMNS: Column[] = [
  { key: 'title', label: 'Title', sortable: true, width: 'w-48' },
  { key: 'description', label: 'Description', sortable: false, width: 'w-64' },
  { key: 'category', label: 'Category', sortable: true, width: 'w-32' },
  { key: 'value', label: 'Value', sortable: false, width: 'w-32' },
  { key: 'connections', label: 'Connections', sortable: false, width: 'w-24' },
  { key: 'owner', label: 'Owner', sortable: false, width: 'w-32' },
  { key: 'tags', label: 'Tags', sortable: false, width: 'w-40' },
  { key: 'updated', label: 'Updated', sortable: true, width: 'w-32' },
  { key: 'actions', label: 'Actions', sortable: false, width: 'w-20' },
];

export const RELATIONSHIP_COLUMNS: Column[] = [
  { key: 'relationship', label: 'Relationship', sortable: true, width: 'w-64' },
  { key: 'notes', label: 'Notes', sortable: false, width: 'w-64' },
  { key: 'type', label: 'Type', sortable: true, width: 'w-32' },
  { key: 'confidence', label: 'Confidence', sortable: true, width: 'w-28' },
  { key: 'weight', label: 'Weight', sortable: true, width: 'w-20' },
  { key: 'evidence', label: 'Evidence', sortable: false, width: 'w-24' },
  { key: 'tags', label: 'Tags', sortable: false, width: 'w-40' },
  { key: 'updated', label: 'Updated', sortable: true, width: 'w-32' },
  { key: 'actions', label: 'Actions', sortable: false, width: 'w-20' },
];
