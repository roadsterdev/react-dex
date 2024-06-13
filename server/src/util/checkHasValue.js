const hasValue = (data) => {
  const key = Object.keys(data)[0];
  const value = data[key];

  return Object.keys(Object.values(value)[0]).length > 0;
}

module.exports = { hasValue };