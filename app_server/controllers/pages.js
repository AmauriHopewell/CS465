const renderPage = (view, title) => (req, res) => {
  res.render(view, { title, page: view });
};

const rooms = renderPage('rooms', 'Rooms - Travlr Getaways');
const meals = renderPage('meals', 'Meals - Travlr Getaways');
const news = renderPage('news', 'News - Travlr Getaways');
const about = renderPage('about', 'About - Travlr Getaways');
const contact = renderPage('contact', 'Contact - Travlr Getaways');

const contactSubmit = (req, res) => {
  res.redirect(303, '/contact');
};

module.exports = {
  rooms,
  meals,
  news,
  about,
  contact,
  contactSubmit
};
