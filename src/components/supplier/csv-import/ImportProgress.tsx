
interface ImportProgressProps {
  importStatus: {
    total: number;
    success: number;
    failed: number;
  };
}

const ImportProgress = ({ importStatus }: ImportProgressProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex justify-between text-sm mb-2">
        <span>Total:</span>
        <span className="font-medium">{importStatus.total}</span>
      </div>
      
      {importStatus.success > 0 && (
        <div className="flex justify-between text-sm text-green-600 mb-2">
          <span>Réussis:</span>
          <span className="font-medium">{importStatus.success}</span>
        </div>
      )}
      
      {importStatus.failed > 0 && (
        <div className="flex justify-between text-sm text-red-600">
          <span>Échecs:</span>
          <span className="font-medium">{importStatus.failed}</span>
        </div>
      )}
      
      <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-teal-600 rounded-full"
          style={{ width: `${Math.floor((importStatus.success + importStatus.failed) / importStatus.total * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ImportProgress;
