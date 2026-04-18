/* =============================================
   MITHO MITHO MITHO – JavaScript Logic
   Handles: Navigation, Menu, Orders, Reviews, Auth
   ============================================= */

/* ---- PAGE NAVIGATION ---- */
// Shows a specific page and hides all others
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Remove 'active' from all nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show the selected page
  document.getElementById('page-' + pageName).classList.add('active');
  // Highlight the selected nav button
  document.getElementById('nav-' + pageName).classList.add('active');

  // Scroll to top when changing pages
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu if open
  document.querySelector('.nav-links').classList.remove('open');
}

// Toggle mobile hamburger menu
function toggleMobileMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

/* =============================================
   MENU DATA – All food items for the menu page
   ============================================= */
const menuData = {
  ramen: [
    { emoji: '🍜', name: 'Signature Nepali Ramen', desc: 'Rich 12-hour broth, hand-rolled noodles, soft egg & chilli', price: 350 },
    { emoji: '🍲', name: 'Spicy Thukpa Ramen', desc: 'Tibetan-style spicy noodle soup with vegetables & chicken', price: 320 },
    { emoji: '🥩', name: 'Buff Bone Ramen', desc: 'Buffalo bone broth, thick noodles & marinated buff slices', price: 390 },
    { emoji: '🌱', name: 'Veggie Ramen', desc: 'Light vegetable broth with tofu, greens & seasonal veggies', price: 280 },
  ],
  classics: [
    { emoji: '🍛', name: 'Dal Bhat Set', desc: 'Full Nepali thali: lentil soup, steamed rice, tarkari, achar & papad', price: 220 },
    { emoji: '🥟', name: 'Steam Momos (10 pcs)', desc: 'Juicy buff or veggie dumplings with fiery tomato chutney', price: 180 },
    { emoji: '🔥', name: 'Fried Momos', desc: 'Golden crispy momos, served with sesame-chilli dip', price: 200 },
    { emoji: '🥘', name: 'Gundruk Soup', desc: 'Fermented leafy greens soup – a mountain classic!', price: 150 },
    { emoji: '🍱', name: 'Sel Roti with Achar', desc: 'Traditional ring-shaped rice bread with homemade pickle', price: 120 },
    { emoji: '🐔', name: 'Chicken Sekuwa', desc: 'Marinated grilled chicken pieces with Nepali spices', price: 380 },
  ],
  drinks: [
    { emoji: '🍵', name: 'Mitho Masala Chiya', desc: 'Our signature spiced milk tea – brewed fresh every hour!', price: 80 },
    { emoji: '🫖', name: 'Tulsi Green Tea', desc: 'Holy basil green tea from Himalayan herbs', price: 70 },
    { emoji: '🥛', name: 'Lassi', desc: 'Sweet or salty yoghurt drink, thick & chilled', price: 100 },
    { emoji: '🌿', name: 'Ginger Lemon Honey Tea', desc: 'A warming blend of fresh ginger, lemon & honey', price: 90 },
  ],
  kits: [
    { emoji: '📦', name: 'Ramen Kit (2 servings)', desc: 'All ingredients to make our signature ramen at home', price: 450 },
    { emoji: '🛍️', name: 'Momo Kit (20 pcs)', desc: 'Pre-made momo filling, wrappers & chutney mix', price: 300 },
    { emoji: '🌶️', name: 'Spice Mix Pack', desc: 'Authentic Nepali spice blend for dal, curry & sekuwa', price: 250 },
    { emoji: '🍵', name: 'Masala Chiya Kit', desc: 'Premium tea blend with our secret masala spice mix', price: 200 },
  ],
};

// Build and inject food cards into the menu page
function buildMenu() {
  Object.entries(menuData).forEach(([category, items]) => {
    const grid = document.getElementById('food-grid-' + category);
    if (!grid) return;
    grid.innerHTML = items.map(item => `
      <div class="food-card">
        <span class="food-emoji">${item.emoji}</span>
        <div class="food-name">${item.name}</div>
        <div class="food-desc">${item.desc}</div>
        <div class="food-price">NPR ${item.price}</div>
        <button class="buy-btn" onclick="openOrder('${item.name}', ${item.price})">🛒 Buy Now</button>
      </div>
    `).join('');
  });
}

/* =============================================
   ORDER MODAL LOGIC
   ============================================= */
let currentOrderItem = '';
let currentOrderPrice = 0;
let currentQty = 1;

// Open the order modal for a given item
function openOrder(itemName, price) {
  currentOrderItem = itemName;
  currentOrderPrice = price;
  currentQty = 1;

  document.getElementById('modal-item-name').textContent = itemName;
  document.getElementById('modal-item-price').textContent = 'NPR ' + price + ' per item';
  document.getElementById('qty-display').textContent = 1;
  document.getElementById('modal-total').textContent = price;
  document.getElementById('order-success').style.display = 'none';

  document.getElementById('order-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

// Close the modal
function closeOrder() {
  document.getElementById('order-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// Increase or decrease quantity
function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('qty-display').textContent = currentQty;
  document.getElementById('modal-total').textContent = (currentOrderPrice * currentQty).toLocaleString();
}

// Confirm the order and show success
function confirmOrder() {
  const payment = document.querySelector('input[name="pay"]:checked').value;
  const payLabel = { cod: 'Cash on Delivery', esewa: 'eSewa', khalti: 'Khalti' }[payment];
  document.getElementById('order-success').style.display = 'block';
  document.getElementById('order-success').innerHTML = `
    🎉 Order Placed! <strong>${currentQty}x ${currentOrderItem}</strong><br/>
    Payment: ${payLabel} · Total: NPR ${(currentOrderPrice * currentQty).toLocaleString()}<br/>
    We'll be ready soon. <em>Mitho raho!</em> 🙏
  `;
  // Auto-close modal after 3 seconds
  setTimeout(closeOrder, 3500);
}

// Close modal if clicking the overlay (outside the box)
document.getElementById('order-modal').addEventListener('click', function(e) {
  if (e.target === this) closeOrder();
});

/* =============================================
   AUTH FORM TABS (Login / Signup)
   ============================================= */
function switchTab(tab) {
  // Toggle tab buttons
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');

  // Toggle form visibility
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
}

// Handle form submission (demo – just shows a success message)
function handleAuth(type) {
  const msg = document.getElementById('auth-msg-' + type);
  if (type === 'login') {
    msg.textContent = '✅ Logged in successfully! Welcome back to Mitho Mitho Mitho! 🙏';
  } else {
    msg.textContent = '🎉 Account created! Welcome to the Mitho family! 🍜';
  }
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 4000);
}

/* =============================================
   REVIEWS DATA & RENDERING
   ============================================= */
const reviewsData = [
  { name: 'Aarav Sharma', avatar: '👨', stars: 5, text: 'Absolutely amazing ramen! The broth was incredibly rich and flavourful. Best food I\'ve had in Kathmandu by far!', tag: '🍜 Ramen' },
  { name: 'Priya Karki', avatar: '👩', stars: 5, text: 'The masala chiya here is unmatched! So perfectly spiced and creamy. I visit every morning now. Mitho Mitho Mitho is truly mitho!', tag: '🍵 Tea' },
  { name: 'Rohan Thapa', avatar: '👦', stars: 5, text: 'The dal bhat thali is exactly like my grandmother used to make. Authentic flavours, generous portions, and super clean kitchen!', tag: '🥘 Thali' },
  { name: 'Sita Gurung', avatar: '👧', stars: 5, text: 'Ordered the family feast offer for our get-together — everyone was blown away. Amazing value and the service was so warm!', tag: '🎉 Family Offer' },
  { name: 'Bikram Rai', avatar: '🧑', stars: 5, text: 'The momos here are legendary. Juicy filling, perfect wrapper, and that chutney... wow! I drive 45 mins just for this.', tag: '🥟 Momos' },
  { name: 'Anita Poudel', avatar: '👩‍🦱', stars: 5, text: 'Hygiene standards are top notch — you can see the kitchen from the dining area. Everything is spotlessly clean. Love it!', tag: '🧼 Hygiene' },
  { name: 'Dev Maharjan', avatar: '👨‍🦲', stars: 5, text: 'Shreya didi has built something truly special here. The staff are so friendly and welcoming. Feels like eating at home!', tag: '💗 Service' },
  { name: 'Nisha Tamang', avatar: '👩‍🦰', stars: 5, text: 'Tried the raw meal kit for ramen and cooked it at home. Turned out perfect! Will definitely order again. So easy to follow.', tag: '📦 Meal Kit' },
  { name: 'Kiran Shrestha', avatar: '🧔', stars: 5, text: 'Best restaurant in Thamel without a doubt. The veggie ramen is incredible for a non-meat eater like me. So much flavour!', tag: '🌱 Vegan' },
  { name: 'Mina Bajracharya', avatar: '👩‍🍳', stars: 5, text: 'As a food blogger, I\'ve eaten everywhere in Kathmandu. Mitho Mitho Mitho consistently ranks in my top 3. Exceptional quality.', tag: '📸 Blogger' },
  { name: 'Suraj Adhikari', avatar: '👨‍💼', stars: 5, text: 'Took international colleagues here and they were completely impressed with Nepali cuisine. The staff even explained each dish beautifully!', tag: '🌍 Visitor' },
  { name: 'Deepa KC', avatar: '👩‍🎓', stars: 5, text: 'The ginger lemon honey tea cured my cold! Not joking. And the gundruk soup was exactly what I needed. So comforting and delicious.', tag: '🫖 Tea' },
  { name: 'Sambhu Limbu', avatar: '👨‍🌾', stars: 5, text: 'Festival special offer was incredible! Sel roti was perfectly crispy and the thali was overflowing with food. Great value for money!', tag: '🎊 Festival' },
  { name: 'Kamala Lama', avatar: '🧓', stars: 5, text: 'I\'m a regular here for 2 years. The quality has never dropped even once. Mitho Mitho Mitho is truly consistent and wonderful.', tag: '⭐ Regular' },
  { name: 'Binod Giri', avatar: '🧑‍🤝‍🧑', stars: 5, text: 'Brought my whole family — 8 people — and everyone loved something different on the menu. That\'s how versatile this place is!', tag: '👨‍👩‍👧‍👦 Family' },
];

// More reviews for "load more" functionality
const moreReviews = [
  { name: 'Rukmini Dhakal', avatar: '👩', stars: 5, text: 'The buff sekuwa was perfectly chargrilled with smoky Nepali spices. My husband said it\'s the best meat he\'s ever tasted!', tag: '🔥 Sekuwa' },
  { name: 'Tarun Sapkota', avatar: '👨', stars: 5, text: 'Friendly workers, clean environment, speedy service and most importantly — divine food! 10/10 would recommend to everyone visiting Nepal.', tag: '✅ Must Visit' },
  { name: 'Pooja Tiwari', avatar: '👩‍🦱', stars: 5, text: 'The lassi here is thick, sweet, and chilled to perfection. Perfect after a heavy ramen meal! I always end my visits with one.', tag: '🥛 Lassi' },
  { name: 'Nirmal Ghimire', avatar: '🧑', stars: 5, text: 'Visited during Dashain and the festival thali was absolutely out of this world. Beautiful presentation and incredible flavours throughout!', tag: '🙏 Dashain' },
  { name: 'Sunita Basnet', avatar: '👩', stars: 5, text: 'Bought the spice mix pack to take back to the UK and everyone at home absolutely loved cooking with it. Brings Nepal home!', tag: '🌶️ Spice Kit' },
  { name: 'Prakash Oli', avatar: '👨', stars: 5, text: 'Clean, fast, delicious and affordable. In a city with so many choices, Mitho Mitho Mitho stands head and shoulders above the rest!', tag: '🏆 Best Choice' },
];

let reviewsShown = false; // track if more reviews have been loaded

// Render the first batch of reviews
function buildReviews() {
  const grid = document.getElementById('review-grid');
  grid.innerHTML = reviewsData.map(r => createReviewCard(r)).join('');
}

// Create a single review card HTML string
function createReviewCard(r) {
  const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
  return `
    <div class="review-card">
      <div class="rev-header">
        <div class="rev-avatar">${r.avatar}</div>
        <div>
          <div class="rev-name">${r.name}</div>
          <div class="rev-stars">${stars}</div>
        </div>
      </div>
      <p class="rev-text">${r.text}</p>
      <span class="rev-tag">${r.tag}</span>
    </div>
  `;
}

// Load additional reviews on button click
function loadMoreReviews() {
  if (!reviewsShown) {
    const grid = document.getElementById('review-grid');
    grid.innerHTML += moreReviews.map(r => createReviewCard(r)).join('');
    reviewsShown = true;
    document.getElementById('load-more-btn').textContent = '✅ All Reviews Loaded!';
    document.getElementById('load-more-btn').disabled = true;
    document.getElementById('load-more-btn').style.opacity = '0.6';
  }
}

/* =============================================
   STAR RATING SELECTOR (Write Review)
   ============================================= */
let selectedRating = 0;

function setRating(val) {
  selectedRating = val;
  // Update star colours based on selected value
  document.querySelectorAll('#star-selector .star').forEach((star, index) => {
    star.classList.toggle('active', index < val);
  });
}

// Submit a new review (appends it to the grid)
function submitReview() {
  const name = document.getElementById('rev-name').value.trim();
  const text = document.getElementById('rev-text').value.trim();

  // Validation
  if (!name || !text || selectedRating === 0) {
    alert('Please fill in your name, rating and review text!');
    return;
  }

  // Create new review object
  const newReview = {
    name: name,
    avatar: '😊',
    stars: selectedRating,
    text: text,
    tag: '✍️ New Review',
  };

  // Prepend it to the review grid
  const grid = document.getElementById('review-grid');
  grid.insertAdjacentHTML('afterbegin', createReviewCard(newReview));

  // Show success message and reset form
  document.getElementById('review-submitted-msg').style.display = 'block';
  document.getElementById('rev-name').value = '';
  document.getElementById('rev-text').value = '';
  setRating(0); // reset stars
  setTimeout(() => { document.getElementById('review-submitted-msg').style.display = 'none'; }, 4000);
}

/* =============================================
   INITIALISATION – Run when page loads
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  buildMenu();    // Build all food cards in menu
  buildReviews(); // Build all review cards
});
