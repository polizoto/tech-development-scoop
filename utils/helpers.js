module.exports = {
    format_date: date => {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
          return `${word}s`;
        }
        return word;
      },
      isShort: content => {
        if (content.length >= 1 && content <= 600) {
          return `${content}`;
        }
      },
      isTooLong: content => {
        if (content.length >= 1 && content <= 200) {
          return `${content}`;
        }
      }
  }