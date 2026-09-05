# Database Schema Documentation — StockSense

The database utilizes MongoDB with Mongoose ODM schemas.

## Models Overview

### 1. User (`users`)
- `_id`: ObjectId
- `name`: String (required, trimmed)
- `email`: String (unique, required, lowercase)
- `passwordHash`: String (bcrypt hash)
- `avatar`: String (optional)
- `preferences`: Object (theme: 'dark' | 'light', currency: 'INR' | 'USD')
- `createdAt`, `updatedAt`: Date timestamps

### 2. Stock (`stocks`)
- `_id`: ObjectId
- `symbol`: String (unique, uppercase index)
- `companyName`: String
- `exchange`: String (e.g. NSE, BSE, NASDAQ)
- `sector`: String
- `industry`: String
- `lastUpdated`: Date

### 3. HistoricalPrice (`historicalprices`)
- `_id`: ObjectId
- `symbol`: String (indexed)
- `date`: Date (indexed)
- `open`: Number
- `high`: Number
- `low`: Number
- `close`: Number
- `volume`: Number
- *Compound Index*: `{ symbol: 1, date: -1 }`

### 4. Watchlist (`watchlists`)
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User', indexed)
- `symbol`: String (indexed)
- `companyName`: String
- `exchange`: String
- `createdAt`: Date
- *Compound Unique Index*: `{ userId: 1, symbol: 1 }`

### 5. Portfolio (`portfolios`)
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User', indexed)
- `name`: String (default: 'Main Portfolio')
- `createdAt`, `updatedAt`: Date timestamps

### 6. Holding (`holdings`)
- `_id`: ObjectId
- `portfolioId`: ObjectId (ref: 'Portfolio', indexed)
- `symbol`: String
- `quantity`: Number
- `averageBuyPrice`: Number
- `createdAt`, `updatedAt`: Date timestamps

### 7. NewsArticle (`newsarticles`)
- `_id`: ObjectId
- `symbol`: String (indexed)
- `title`: String
- `description`: String
- `url`: String
- `source`: String
- `publishedAt`: Date
- `sentiment`: String ('positive' | 'neutral' | 'negative')
- `sentimentScore`: Number (-1.0 to 1.0)
- `createdAt`: Date

### 8. Prediction (`predictions`)
- `_id`: ObjectId
- `symbol`: String (indexed)
- `predictionDate`: Date
- `forecastDate`: Date
- `predictedPrice`: Number
- `lowerRange`: Number
- `upperRange`: Number
- `confidence`: Number (0.0 to 1.0)
- `modelName`: String ('XGBoost' | 'RandomForest')
- `modelVersion`: String
- `createdAt`: Date

### 9. Alert (`alerts`)
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User', indexed)
- `symbol`: String
- `condition`: String ('PRICE_ABOVE' | 'PRICE_BELOW' | 'RSI_ABOVE' | 'RSI_BELOW')
- `targetValue`: Number
- `isTriggered`: Boolean (default: false)
- `createdAt`: Date
