# বাজার দর (BazarDor)

BazarDor is a Bengali-language market price tracking web application that helps users explore everyday products, compare prices, and view market price information.

## Features

- **Homepage:** Browse products and explore market price information.
- **Bengali Product Search:** Search for products using Bengali names.
- **Product Categories:** Browse products by categories such as rice, lentils, oil, vegetables, fish, and meat.
- **Product Details:** View individual product information and current and previous prices.
- **Market Price Comparison:** View available market price ranges for products.
- **Price Trends:** Explore price changes and historical price information where available.
- **User Authentication:** Register and sign in using email and password.
- **Protected Account:** Access account information through a protected page.
- **Responsive Design:** Use the application on mobile, tablet, and desktop screens.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

Clone the repository:

```bash
git clone https://github.com/iimdadd/B14-A7-BazarDor.git
```

Move into the project directory:

```bash
cd B14-A7-BazarDor
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and configure the environment variables required by the application. Never commit secret keys or database credentials.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` — Application pages and API routes.
- `components/` — Reusable user interface components.
- `lib/` — Authentication, database, and API utilities.
- `public/` — Static assets.

## Important Note

Market prices may change according to location, availability, and market conditions. Check the displayed information before making purchasing decisions.

## Repository

[GitHub — BazarDor](https://github.com/iimdadd/B14-A7-BazarDor)

## Deployment

The application can be deployed on [Vercel](https://vercel.com/). Configure the required environment variables in the deployment settings before deploying.
