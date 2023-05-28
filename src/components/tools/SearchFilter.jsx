/**
 * Filter the search results based on a search term.
 * @param {string} searchTerm - The term to search for.
 * @param {Object} data - The data containing the search results.
 * @param {Array} data.results - The array of results to filter.
 * @returns {Array} - The filtered results.
 */
export function filterResults(searchTerm, { results }) {
  const filteredResults = [];
  results.map((result) => {
    if (result.media.length !== 0) {
      if (result.description === null) {
        if (result.title.toLowerCase().includes(searchTerm.toLowerCase()) || result.seller.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredResults.push(result);
        }
      } else {
        if (
          result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.location.country.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          filteredResults.push(result);
        }
      }
    }
  });
  return filteredResults;
}
