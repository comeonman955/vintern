// Re-export the detail component
import Applications from './Applications';
export default function ApplicationDetail() {
  return <Applications detail={true} />;
}
