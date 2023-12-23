const helpers = {
    formatCurrency: (amount) => {
      return new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
    formatDate: (date) => {
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    },
    add: (a, b) => {
      return a + b;
    },
    equals: (a, b) => {
      return a == b;
    },
    // '012345689' => '01*****789'
    formatPhone: (phone) => {
      return phone.slice(0, 2) + '*****' + phone.slice(7);
    },
    // email breakable => email<wbr />@abc.com
    breakableEmail: (email) => {
      return email.replace('@', '<wbr />@');
    },
};
module.exports = helpers;