# Anonymizer

This project provides an API endpoint for anonymizing sensitive information in text. The API can anonymize names, phone numbers, CNPs (Romanian Personal Identification Numbers), and email addresses based on the configuration. This basic project was developed to be deployed on a Vercel function. 

## API Endpoint

### Anonymize

**URL:** `/api/anonymize`

**Method:** `POST`

**Request Body:**

```json
{
  "text": "Your text here"
}
```

**Response Body:**
```json
{
  "anonymizedText": "Anonymized text here"
}
```

## Configuration

The anonymization configuration is defined in the [anonymization_config.ts](api/anonymization_config.ts) file. You can enable or disable specific types of anonymization by modifying the configuration.

## Running Locally
To run the project locally, follow these steps:

1. Install dependencies:

```
npm install
```

2. Start the local development server:
   
```
vercel dev
```

3. Test the API endpoint:

Use curl or a similar tool to send a POST request to the local server:

```
curl -X POST http://localhost:3000/api/anonymize \
-H "Content-Type: application/json" \
-d '{"text": "John Doe +40712345678 1234567890123 john.doe@example.com"}'
```

## Running Tests

To run the tests, use the following command:

```
npm test
```

The tests are located in the [__tests__](api/__tests__/) directory and cover various scenarios for anonymizing names, phone numbers, CNPs, and emails.

## Deployment

The project is configured to be deployed on Vercel. The [vercel.json](vercel.json) file specifies the build and route configuration.

To deploy the project, use the following command:

```
vercel
```

Follow the prompts to configure your deployment. Vercel will automatically detect your project and deploy it.
