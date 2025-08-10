export default function HoldProjects() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hold Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">Projects currently on hold</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Projects on Hold
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Manage projects that are temporarily paused.
          </p>
        </div>
      </div>
    </div>
  );
}