import {
  Activity,
  Edit,
  FileText,
  Plus,
  Share,
  Trash2,
  Zap,
} from 'lucide-react';

export const getActionIcon = (action: string) => {
  const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center';

  switch (action) {
    case 'created':
      return (
        <div className={`${baseClasses} bg-green-100`}>
          <Plus className="h-4 w-4 text-green-600" />
        </div>
      );
    case 'deleted':
      return (
        <div className={`${baseClasses} bg-red-100`}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </div>
      );
    case 'updated':
      return (
        <div className={`${baseClasses} bg-blue-100`}>
          <Edit className="h-4 w-4 text-blue-600" />
        </div>
      );
    case 'shared':
      return (
        <div className={`${baseClasses} bg-purple-100`}>
          <Share className="h-4 w-4 text-purple-600" />
        </div>
      );
    case 'synchronized':
      return (
        <div className={`${baseClasses} bg-green-100`}>
          <Zap className="h-4 w-4 text-green-600" />
        </div>
      );
    case 'commented':
      return (
        <div className={`${baseClasses} bg-orange-100`}>
          <FileText className="h-4 w-4 text-orange-600" />
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} bg-gray-100`}>
          <Activity className="h-4 w-4 text-gray-600" />
        </div>
      );
  }
};
