/**
 * Format angka menjadi Rupiah
 * @param {number} amount - Jumlah uang
 * @returns {string} Format Rupiah
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format tanggal
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Get asset type label
 * @param {string} type - Asset type (IDX/US/CRYPTO)
 * @returns {string} Label
 */
export const getAssetTypeLabel = (type) => {
  const labels = {
    IDX: "Saham Indonesia",
    US: "Saham US",
    CRYPTO: "Cryptocurrency",
  };
  return labels[type] || type;
};

/**
 * Get asset type badge color
 * @param {string} type - Asset type
 * @returns {string} Tailwind color classes
 */
export const getAssetTypeBadge = (type) => {
  const badges = {
    IDX: "bg-blue-100 text-blue-800",
    US: "bg-green-100 text-green-800",
    CRYPTO: "bg-purple-100 text-purple-800",
  };
  return badges[type] || "bg-gray-100 text-gray-800";
};
