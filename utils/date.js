const getTodayFormatedDate = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  month = date.getMonth() < 10 ? "0" + month.toString() : month;
  let day =
    date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate();
  return `${date.getFullYear()}-${month}-${day}`;
};

module.exports = { getTodayFormatedDate };
