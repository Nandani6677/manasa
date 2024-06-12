const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// Swagger definition options
const swaggerOptions = {
  // swaggerDefinition: require('./swagger/swaggerDef'),
  swaggerDefinition: {
    info: {
      title: "Node demo",
      version: "1.0.0",
      description: "API documentation",
      x_icon: {
        url: path.join(__dirname, "../assets/favicon.png"), // Replace with the path to your custom icon file
        altText: "Custom Icon", // Replace with the alt text for your custom icon
      },
    },
  },
  apis: ["./routes/*.js"], // Use a glob pattern to include all route files
};

const options = {
  customSiteTitle: "Node Basic",
  customfavIcon: path.join(__dirname, "../assets/favicon.png"),
  swaggerOptions: {
    deepLinking: true,
    filter: true, // Displays an input box for filtering the operations by tags.
    showExtensions: true, // Shows the extension fields for each Swagger object.
  },
  customCss: `
          /* Customize the header */
          .swagger-ui .topbar {
            background-color: #fff;
          }
          .swagger-ui .topbar-wrapper {
            border-bottom: none;
          }
    
          /* Customize the sidebar */
          .swagger-ui .scheme-container {
            background-color: #f0f0f0;
            padding: 1px;
          }
    
          /* Customize the main content area */
          .swagger-ui .info .description {
            font-size: 10px;
          }
          .swagger-ui .opblock-tag-section {
            background-color: #f0f0f0;
            border-bottom: none;
          }
          /* Remove the Swagger icon from the header */
            .swagger-ui .topbar .link {
                display: none;
            }
        `,
};

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
};
