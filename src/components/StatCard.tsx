type Props = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 18,
    padding: 18,
  },
  value: {
    fontSize: 30,
    fontWeight: 800,
    color: '#111827',
  },
  label: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 14,
  },
};