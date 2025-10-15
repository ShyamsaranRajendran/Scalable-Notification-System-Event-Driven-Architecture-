# Scalable Notification System (Event-Driven Architecture)

A high-performance, scalable notification system built with event-driven architecture that supports multi-channel delivery (Email, SMS, Push) through message queues for reliable asynchronous processing.

## 🚀 Features

- **Multi-Channel Support**: Send notifications via Email, SMS, and Push notifications
- **Asynchronous Processing**: Decoupled architecture using message queues
- **Reliable Delivery**: Retry mechanisms with exponential backoff and dead letter queues
- **Scalable Microservices**: Independently scalable API and worker services
- **Extensible Design**: Easy to add new notification channels
- **Comprehensive Monitoring**: Track delivery status, failures, and performance metrics
- **Containerized Deployment**: Docker-based setup for easy development and deployment

## 🏗 System Architecture

```mermaid
flowchart LR
    Client -->|HTTP POST /notify| API[Notification API Service]
    API --> MQ[(RabbitMQ / Kafka Queue)]

    subgraph Workers
        E[Email Worker] --> SES[(SMTP / Gmail / MailHog)]
        S[SMS Worker] --> SMS[(Mock / Twilio / SNS)]
        P[Push Worker] --> FCM[(Firebase Cloud Messaging)]
    end

    MQ --> E
    MQ --> S
    MQ --> P

    E --> DB[(PostgreSQL)]
    S --> DB
    P --> DB
```

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 16+ (for local development)
- Git

## 🛠 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd scalable-notification-system
```

### 2. Start Infrastructure Services

```bash
# Start RabbitMQ and PostgreSQL
docker-compose up -d
```

### 3. Install Dependencies

```bash
# Install API service dependencies
cd api-service
npm install

# Install worker dependencies
cd ../workers
npm install
```

### 4. Environment Configuration

Create `.env` files in both `api-service/` and `workers/` directories:

```env
# API Service & Workers Common Environment
RABBITMQ_URL=amqp://localhost:5672
DATABASE_URL=postgresql://user:password@localhost:5432/notification_db

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Push Notification Configuration
FCM_SERVER_KEY=your-fcm-server-key
```

### 5. Start the Services

**Terminal 1 - API Service:**

```bash
cd api-service
npm run dev
```

**Terminal 2 - Workers:**

```bash
cd workers
# Start all workers
npm start

# Or start individually
node emailWorker.js
node smsWorker.js
node pushWorker.js
```

## 📡 API Usage

### Send Notification

**Endpoint:** `POST /api/notify`

**Request Body:**

```json
{
  "type": "email",
  "to": "user@example.com",
  "subject": "Welcome!",
  "message": "Hello, thank you for joining."
}
```

**Supported Types:**

- `email` - Email notifications
- `sms` - SMS notifications
- `push` - Push notifications

**Response:**

```json
{
  "status": "queued",
  "messageId": "b7e6f1d0-3a22-4f2e-9d5a-7db6bba7423d"
}
```

### Example Requests

**Email Notification:**

```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "to": "user@example.com",
    "subject": "Test Email",
    "message": "This is a test email notification."
  }'
```

**SMS Notification:**

```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{
    "type": "sms",
    "to": "+1234567890",
    "message": "This is a test SMS notification."
  }'
```

## 🗄 Database Schema

### Notifications Table

| Column       | Type                    | Description                          |
| ------------ | ----------------------- | ------------------------------------ |
| `id`         | SERIAL PRIMARY KEY      | Unique message ID                    |
| `type`       | VARCHAR(20)             | Notification type (email, sms, push) |
| `receiver`   | VARCHAR(100)            | Destination address                  |
| `message`    | TEXT                    | Message content                      |
| `status`     | VARCHAR(20)             | sent / failed / retrying             |
| `retries`    | INT DEFAULT 0           | Retry count                          |
| `created_at` | TIMESTAMP DEFAULT now() | Creation timestamp                   |
| `updated_at` | TIMESTAMP               | Last updated                         |

## 🔧 Configuration

### Message Queue (RabbitMQ)

- **URL**: `amqp://localhost:5672`
- **Management UI**: http://localhost:15672 (guest/guest)

### Database (PostgreSQL)

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `notification_db`
- **Username**: `user`
- **Password**: `password`

### External Services

- **Email**: Gmail SMTP (configurable)
- **SMS**: Twilio API (mock available for testing)
- **Push**: Firebase Cloud Messaging

## 🚨 Error Handling & Retry Logic

- **Automatic Retries**: Up to 3 attempts with exponential backoff (5s → 15s → 45s)
- **Dead Letter Queue**: Failed messages are moved to DLQ after retries exhausted
- **Status Tracking**: All delivery attempts logged in database
- **Failure Analysis**: Detailed error messages stored for debugging

## 📊 Monitoring

### Access Monitoring Tools

**RabbitMQ Management Console:**

```
http://localhost:15672
Username: guest
Password: guest
```

**Database Queries:**

```sql
-- Check notification status
SELECT type, status, COUNT(*)
FROM notifications
GROUP BY type, status;

-- View failed notifications
SELECT * FROM notifications
WHERE status = 'failed'
ORDER BY created_at DESC;
```

## 🧪 Testing

### Manual Testing with Postman

1. Import the provided Postman collection
2. Set environment variables for different notification types
3. Test each channel with sample payloads

### Automated Tests

```bash
# Run API tests
cd api-service
npm test

# Run worker tests
cd ../workers
npm test
```

## 🔄 Development

### Adding New Notification Channels

1. Create new worker in `workers/` directory
2. Add new message type in API validation
3. Update database schema if needed
4. Add configuration for new service

### Project Structure

```
scalable-notification-system/
├── api-service/           # Express API service
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── workers/              # Consumer workers
│   ├── emailWorker.js
│   ├── smsWorker.js
│   ├── pushWorker.js
│   └── package.json
├── db/
│   └── schema.sql       # Database schema
├── docker-compose.yml   # Infrastructure setup
└── README.md
```

## 🚀 Deployment

### Production Deployment

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

```env
# Production Database
DATABASE_URL=postgresql://prod_user:secure_password@prod-db:5432/notification_prod

# Production Message Queue
RABBITMQ_URL=amqp://rabbitmq:5672

# Production External Services
SMTP_HOST=prod-smtp.example.com
TWILIO_ACCOUNT_SID=prod-account-sid
FCM_SERVER_KEY=prod-fcm-key
```

## 📈 Performance Considerations

- **Horizontal Scaling**: Add more worker instances under load
- **Database Optimization**: Use indexes on status and created_at columns
- **Queue Management**: Monitor queue depths and adjust consumers accordingly
- **Connection Pooling**: Configure database and external API connections

## 🛣 Future Enhancements

- [ ] Authentication & API key management
- [ ] Web dashboard for monitoring and analytics
- [ ] Advanced analytics: delivery rates, failure trends
- [ ] AWS SQS/SNS integration for production scaling
- [ ] Kafka-based event streaming
- [ ] Rate limiting and throttling
- [ ] Template management system
- [ ] A/B testing capabilities

## 🐛 Troubleshooting

### Common Issues

1. **RabbitMQ Connection Failed**

   - Check if RabbitMQ container is running: `docker ps`
   - Verify credentials in environment variables

2. **Database Connection Issues**

   - Ensure PostgreSQL container is running
   - Check database URL format

3. **Email Delivery Failures**

   - Verify SMTP credentials and configuration
   - Check spam folders for test emails

4. **Workers Not Processing**
   - Check RabbitMQ management console for queue status
   - Verify worker logs for connection errors

### Logs and Debugging

```bash
# View service logs
docker-compose logs -f

# View specific service logs
docker-compose logs api-service
docker-compose logs rabbitmq

# Check worker logs
cd workers
npm run logs
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check documentation in `/docs` folder
- Review troubleshooting section above

---

**Built with ❤️ using Node.js, RabbitMQ, PostgreSQL, and Docker**
