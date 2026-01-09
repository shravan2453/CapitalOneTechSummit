function pmt(ratePerPeriod, numberOfPayments, presentValue) {
  if (ratePerPeriod === 0) {
    return presentValue / numberOfPayments;
  }
  const numerator = ratePerPeriod * presentValue;
  const denominator = 1 - Math.pow(1 + ratePerPeriod, -numberOfPayments);
  return numerator / denominator;
}

function payoffYear(termYears) {
  const now = new Date();
  return now.getFullYear() + termYears;
}

function estTotalInterest(payment, nper, principal) {
  return payment * nper - principal;
}

module.exports = { pmt, payoffYear, estTotalInterest };

