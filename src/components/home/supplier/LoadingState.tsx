
const LoadingState = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Chargement des informations du fournisseur...</p>
      </div>
    </div>
  );
};

export default LoadingState;
