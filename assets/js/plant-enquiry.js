(() => {
  const offers = {
  "manufacturing-advisory": "Plant Profit for Manufacturers",
  "plant-profit-diagnostic": "Plant Profit Diagnostic: Find Your Plant's Savings in 45 Days",
  "material-cost-leakage-scan": "Material Cost Leakage Scan: BOM vs Actual in 30 Days",
  "purchase-price-health-check": "Purchase Price Health Check",
  "scrap-yield-recovery": "Scrap and Yield Recovery Sprint",
  "manpower-productivity-study": "Manpower Productivity Study",
  "rejection-quality-cost-sprint": "Rejection and Quality Cost Sprint",
  "maintenance-spares-oee": "Maintenance, Spares and OEE Sprint",
  "capacity-outsourcing-review": "Capacity and Outsourcing Review",
  "price-recovery-product-margin-review": "Price Recovery and Product Margin Review",
  "incentives-recoveries-review": "Incentives and Recoveries Review",
  "inventory-working-capital-scan": "Inventory and Working Capital Scan",
  "group-transfer-pricing-review": "Group Transfer Pricing Review",
  "energy-utilities-audit": "Energy and Utilities Audit",
  "indirect-spend-freight-review": "Indirect Spend and Freight Review",
  "implementation-support": "Implementation Support: Turning Findings into P&L Savings",
  "hyderabad": "Plant Profit Improvement for Manufacturers in Hyderabad",
  "delhi-ncr": "Plant Profit Improvement for Manufacturers in Delhi NCR",
  "nagpur": "Plant Profit Improvement for Manufacturers in Nagpur",
  "bhopal": "Plant Profit Improvement for Manufacturers in Bhopal",
  "indore": "Plant Profit Improvement for Manufacturers in Indore"
};
  const key = new URLSearchParams(window.location.search).get('offer');
  if (!Object.prototype.hasOwnProperty.call(offers, key)) return;
  const offer = offers[key];
  for (const link of document.querySelectorAll('main a[href]')) {
    const url = new URL(link.href);
    if (url.protocol === 'mailto:') {
      url.searchParams.set('subject', 'Manufacturing enquiry — ' + offer);
      link.href = url.toString().replace(/\+/g, '%20');
    } else if (url.hostname === 'wa.me') {
      url.searchParams.set('text', 'Hi PathWeave, I would like to discuss ' + offer + ' for our plant.');
      link.href = url.toString();
    }
  }
})();
