
interface ErrorStateProps {
  error: string | null;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error || "Aucun fournisseur disponible"}</p>
      </div>
    </div>
  );
};

export default ErrorState;
