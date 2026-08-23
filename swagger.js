const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Blog API',
    version: '1.0.0',
    description: 'Backend-only blog API with user auth, posts, comments, and likes.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
      {
      url: 'https://backend-projects-omega.vercel.app/',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserDto: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar: { type: 'string', format: 'uri' },
          coverImage: { type: 'string', format: 'uri' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserDto' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
      PostDto: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          coverImage: { type: 'string', format: 'uri' },
          author: { type: 'object', properties: { _id: { type: 'string' }, username: { type: 'string' }, email: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CommentDto: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          text: { type: 'string' },
          post: { type: 'string' },
          user: { type: 'object', properties: { _id: { type: 'string' }, username: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      LikeDto: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          itemType: { type: 'string' },
          itemId: { type: 'string' },
          user: { type: 'object', properties: { _id: { type: 'string' }, username: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/v1/users/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                  avatar: { type: 'string', format: 'binary' },
                  coverImage: { type: 'string', format: 'binary' },
                },
                required: ['username', 'email', 'password', 'avatar'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/users/login': {
      post: {
        summary: 'Login with email or username',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  username: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User logged in successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/users/logout': {
      post: {
        summary: 'Logout the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User logged out successfully' },
        },
      },
    },
    '/api/v1/users/refresh-token': {
      post: {
        summary: 'Refresh access token using refresh token',
        responses: {
          '200': {
            description: 'Access token refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/posts': {
      get: {
        summary: 'Get all posts',
        responses: {
          '200': {
            description: 'A list of posts',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/PostDto' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new post',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  coverImage: { type: 'string', format: 'binary' },
                },
                required: ['title', 'content'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Post created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PostDto' },
              },
            },
          },
        },
      },
    },
    '/api/v1/posts/{id}': {
      get: {
        summary: 'Get a post by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Post details returned',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PostDto' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update a post',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  coverImage: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Post updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PostDto' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a post',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Post deleted successfully' },
        },
      },
    },
    '/api/v1/comments/post/{postId}': {
      get: {
        summary: 'Get comments for a post',
        parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Comments returned',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/CommentDto' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a comment for a post',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { text: { type: 'string' } },
                required: ['text'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Comment created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommentDto' },
              },
            },
          },
        },
      },
    },
    '/api/v1/comments/{commentId}': {
      patch: {
        summary: 'Update a comment',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { text: { type: 'string' } },
              },
            },
          },
        },
        responses: { '200': { description: 'Comment updated successfully' } },
      },
      delete: {
        summary: 'Delete a comment',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Comment deleted successfully' } },
      },
    },
    '/api/v1/likes/{itemType}/{itemId}': {
      get: {
        summary: 'Get likes for an item',
        parameters: [
          { name: 'itemType', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Likes returned successfully',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/LikeDto' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Like an item',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'itemType', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { '201': { description: 'Item liked successfully' } },
      },
      delete: {
        summary: 'Unlike an item',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'itemType', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Item unliked successfully' } },
      },
    },
  },
};
    {
      url: 'https://backend-projects-omega.vercel.app',
      description: 'Production server',
    },
