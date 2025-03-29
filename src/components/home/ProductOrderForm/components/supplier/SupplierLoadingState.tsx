
const SupplierLoadingState = () => {
  return (
    <div className="text-center py-4">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-2 text-sm text-gray-500">Chargement des fournisseurs...</p>
    </div>
  );
};

export default SupplierLoadingState;
