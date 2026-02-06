export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About AnticiPay</h3>
            <p className="text-sm text-gray-600">
              Crowdfunded Adaptive Disaster Relief Streaming - delivering anticipatory aid before crises strike.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Network</h3>
            <p className="text-sm text-gray-600">
              Built on Base Sepolia testnet for transparent, efficient disaster relief funding.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <p className="text-sm text-gray-600">
              Open-source project for humanitarian technology.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} AnticiPay. Built with ❤️ for humanitarian aid.
          </p>
        </div>
      </div>
    </footer>
  );
}
