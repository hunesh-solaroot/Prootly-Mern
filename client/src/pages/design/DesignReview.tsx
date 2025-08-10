export default function DesignReview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Design Review</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and approve design submissions</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Design Review Dashboard
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Review pending designs and provide feedback.
          </p>
        </div>
      </div>
    </div>
  );
}