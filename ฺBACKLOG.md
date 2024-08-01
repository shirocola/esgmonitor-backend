# EcoMonitor Backlog

## MVP (Minimum Viable Product)

The MVP for EcoMonitor will include the following features:

1. User authentication and management.
2. Basic carbon footprint calculation and data input.
3. Real-time dashboard for carbon footprint visualization.
4. Basic reporting capabilities.
5. Integration with at least one external data source for automatic data collection.

## Functional Requirements

1. **User Authentication and Management:**
    - Users must be able to register, log in, and manage their profiles.
    - Admin users can create and manage other user accounts.
    
2. **Carbon Footprint Calculation:**
    - Users can input data manually for carbon footprint calculation.
    - The system calculates carbon emissions based on user input.
    - Historical data is stored and can be retrieved for trend analysis.
    
3. **Dashboards:**
    - Real-time visualization of carbon footprint data.
    - Users can customize their dashboards to display relevant metrics.
    - The system provides alerts when emissions exceed certain thresholds.
    
4. **Reporting:**
    - Users can generate detailed reports on their carbon footprint.
    - Reports can be exported in various formats (PDF, Excel).
    
5. **Integration:**
    - The system integrates with external APIs to fetch data automatically.

## Non-Functional Requirements

1. **Performance:**
    - The application should handle up to 10,000 concurrent users without performance degradation.
    
2. **Scalability:**
    - The system should be designed to scale horizontally to accommodate increased load.
    
3. **Security:**
    - User data must be stored securely, with encryption at rest and in transit.
    - The application should comply with GDPR and other relevant regulations.
    
4. **Usability:**
    - The user interface should be intuitive and easy to use.
    
5. **Reliability:**
    - The system should have an uptime of 99.9%.

## User Stories with Details

### Story 1: As a user, I want to input my energy consumption data so that I can calculate my carbon footprint.

#### Acceptance Criteria:
- The user can input data such as electricity usage, fuel consumption, and waste production.
- The data is saved to the database.
- The user receives a confirmation message after data is saved.

#### Technical Requirements:
- REST API to input data: POST /api/carbon-footprint
- Response: 200 OK with a success message.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test the endpoint to ensure data is saved correctly.
2. Test the confirmation message after data input.
3. Test error handling for invalid data input.

### Story 2: As a user, I want to view historical carbon footprint data so that I can analyze trends over time.

#### Acceptance Criteria:
- The user can view historical data on a dashboard.
- Data is displayed in a chart format, showing trends over time.
- The user can filter data by date range.

#### Technical Requirements:
- REST API to retrieve historical data: GET /api/carbon-footprint/history
- Response: 200 OK with historical data in JSON format.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test data retrieval and ensure it displays correctly in charts.
2. Test the filtering functionality by date range.
3. Test error handling for data retrieval failures.

### Story 3: As a user, I want to generate reports on my carbon footprint so that I can identify areas for improvement.

#### Acceptance Criteria:
- The user can generate a report with a summary of their carbon footprint.
- The report can be downloaded as a PDF or Excel file.
- The user receives a confirmation message when the report is ready for download.

#### Technical Requirements:
- REST API to generate reports: POST /api/carbon-footprint/report
- Response: 200 OK with a link to download the report.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test report generation and ensure it contains accurate data.
2. Test the download functionality for PDF and Excel formats.
3. Test error handling for report generation failures.

### Story 4: As a user, I want to see real-time visualizations of my carbon footprint data so that I can monitor my emissions.

#### Acceptance Criteria:
- The user can view real-time data on a dashboard.
- The dashboard updates automatically with new data.
- The user can customize the dashboard to show relevant metrics.

#### Technical Requirements:
- WebSocket or REST API to fetch real-time data: GET /api/carbon-footprint/realtime
- Response: 200 OK with real-time data in JSON format.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test real-time data fetching and ensure it updates on the dashboard.
2. Test the customization options for the dashboard.
3. Test error handling for real-time data fetching failures.

### Story 5: As an admin, I want to create and manage user accounts so that I can control access to the application.

#### Acceptance Criteria:
- The admin can create, update, and delete user accounts.
- The admin can assign roles to users (e.g., admin, user).
- The admin receives a confirmation message after performing user management actions.

#### Technical Requirements:
- REST API to manage users: POST /api/users, PUT /api/users/:id, DELETE /api/users/:id
- Response: 200 OK with a success message.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test user account creation, updating, and deletion.
2. Test role assignment for different user types.
3. Test error handling for user management actions.

### Story 6: As a user, I want to log in securely using OAuth2 so that my data is protected.

#### Acceptance Criteria:
- The user can log in using their OAuth2 credentials.
- The user receives an authentication token upon successful login.
- The user can access protected resources with their authentication token.

#### Technical Requirements:
- OAuth2 integration with endpoints: POST /auth/login, POST /auth/refresh-token
- Response: 200 OK with an authentication token.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test OAuth2 login and ensure the user receives a valid token.
2. Test token-based access to protected resources.
3. Test error handling for authentication failures.

### Story 7: As a user, I want to access the application via a mobile app so that I can use it on the go.

#### Acceptance Criteria:
- The user can log in and access their data on the mobile app.
- The mobile app provides the same functionality as the web application.
- The user receives notifications on their mobile device.

#### Technical Requirements:
- Develop a mobile app using Flutter.
- Use REST APIs for data fetching and user actions.

#### Test Cases:
1. Test mobile app login and ensure data synchronization.
2. Test functionality parity between the web and mobile app.
3. Test push notifications on the mobile app.

### Story 8: As a user, I want to access help guides and FAQs so that I can resolve my issues quickly.

#### Acceptance Criteria:
- The user can view help guides and FAQs within the application.
- The help guides and FAQs are searchable.
- The user can contact support if they can't find the answer to their question.

#### Technical Requirements:
- Static content for help guides and FAQs.
- Contact support form or chat functionality.

#### Test Cases:
1. Test the display and search functionality of help guides and FAQs.
2. Test the contact support form or chat functionality.
3. Test error handling for search and contact support features.

### Story 9: As a user, I want to set up alerts for high emissions so that I can take corrective actions promptly.

#### Acceptance Criteria:
- The user can set thresholds for various emissions.
- The system sends alerts when thresholds are exceeded.
- The user can view and manage their alerts.

#### Technical Requirements:
- REST API to manage alerts: POST /api/alerts, GET /api/alerts
- Response: 200 OK with alert data.
- Handle any errors and respond with appropriate error messages and status codes.

#### Test Cases:
1. Test alert creation and threshold settings.
2. Test the notification system when thresholds are exceeded.
3. Test error handling for alert management.

## Additional Functional Requirements

1. **Google Login:**
    - Implement Google OAuth2 for user authentication.
    - Allow users to log in using their Google accounts.
    
2. **Google Analytics 4:**
    - Integrate Google Analytics 4 to track user interactions and application usage.
    - Set up custom events and goals to monitor key metrics.
    
3. **Data Pipeline and Data Lake Integration:**
    - Develop a data pipeline to collect, process, and store data in a data lake.
    - Integrate the data lake with Power BI and Excel for advanced analytics and reporting.

## Updated Project Plan and User Stories

### User Stories with Details

#### Story 1: As a user, I want to log in securely using my Google account so that I can access the application easily.

##### Acceptance Criteria:
- The user can log in using their Google account.
- The user receives an authentication token upon successful login.
- The user can access protected resources with their authentication token.

##### Technical Requirements:
- Integrate Google OAuth2: POST /auth/google
- Response: 200 OK with an authentication token.
- Handle any errors and respond with appropriate error messages and status codes.

##### Test Cases:
1. Test Google OAuth2 login and ensure the user receives a valid token.
2. Test token-based access to protected resources.
3. Test error handling for authentication failures.

#### Story 2: As an admin, I want to track user interactions using Google Analytics 4 so that I can analyze application usage.

##### Acceptance Criteria:
- Google Analytics 4 is integrated into the application.
- Custom events and goals are set up to track key metrics.
- Admin can view reports and analytics in the Google Analytics dashboard.

##### Technical Requirements:
- Integrate Google Analytics 4 in the frontend.
- Set up tracking code and custom events.

##### Test Cases:
1. Test Google Analytics 4 integration and event tracking.
2. Test custom goals and metrics.
3. Test error handling for analytics tracking.

#### Story 3: As a data analyst, I want to collect and process data into a data lake so that I can perform advanced analytics.

##### Acceptance Criteria:
- Data pipeline is set up to collect and process data from various sources.
- Data is stored securely in a data lake.
- Data is available for analysis in Power BI and Excel.

##### Technical Requirements:
- Set up a data pipeline using tools like Apache Kafka or AWS Data Pipeline.
- Store data in a data lake (e.g., AWS S3, Azure Data Lake).
- Integrate data lake with Power BI and Excel using connectors or APIs.

##### Test Cases:
1. Test data pipeline setup and data flow.
2. Test data storage and retrieval from the data lake.
3. Test integration with Power BI and Excel.

### Updated Project Plan

#### Phase 1: Planning and Design
- Define project scope and objectives (Completed)
- Gather detailed requirements (Ongoing)
- Design system architecture
- Create data models and database schema

#### Phase 2: Development
- Set up development environment
- Develop backend with NestJS
- Develop frontend with Next.js and Flutter
- Implement authentication and user management
- Integrate with external APIs for data collection
- Develop carbon footprint calculation and dashboard modules
- **New:** Integrate Google OAuth2 for user login
- **New:** Integrate Google Analytics 4 for tracking

#### Phase 3: Testing
- Write unit and integration tests
- Conduct load and performance testing
- Perform user acceptance testing

#### Phase 4: Data Pipeline and Data Lake Integration
- **New:** Set up data pipeline to collect and process data
- **New:** Store data in a data lake (e.g., AWS S3, Azure Data Lake)
- **New:** Integrate data lake with Power BI and Excel

#### Phase 5: Deployment
- Set up CI/CD pipelines with GitHub Actions and ArgoCD
- Deploy application to Kubernetes
- Configure monitoring with Prometheus and Grafana

#### Phase 6: Launch and Post-Launch
- Launch the application
- Monitor performance and gather user feedback
- Iterate and improve based on feedback

### Detailed Task Breakdown
- Week 1-2: Finalize requirements, design architecture, and create data models.
- Week 3-6: Backend development, including authentication, carbon footprint calculation, and dashboards.
- Week 7-10: Frontend development with Next.js and Flutter, integrating with backend APIs.
- **New:** Week 11-12: Integrate Google OAuth2 for login and Google Analytics 4.
- **New:** Week 13-14: Set up data pipeline and data lake integration with Power BI and Excel.
- Week 15-16: Testing (unit, integration, load, and UAT).
- Week 17-18: CI/CD setup, deployment, and monitoring configuration.
- Week 19: Launch and initial post-launch monitoring.
