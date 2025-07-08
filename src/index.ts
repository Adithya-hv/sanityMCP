#!/usr/bin/env node
import express from 'express'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {registerAllPrompts} from './prompts/register.js'
import {registerAllResources} from './resources/register.js'
import {registerAllTools} from './tools/register.js'
import {env} from './config/env.js'
import {VERSION} from './config/version.js'
import cors from 'cors';

const MCP_SERVER_NAME = '@sanity/mcp-server'

async function initializeServer() {
  const server = new McpServer({
    name: MCP_SERVER_NAME,
    version: VERSION,
  })

  registerAllTools(server, env.data?.MCP_USER_ROLE)
  registerAllPrompts(server)
  registerAllResources(server)

  return server
}



const app = express()
app.use(express.json())
app.use(
  cors({
    origin: env.data?.FRONTEND_URL //frontend dev server
  })
);

async function main() {
  try {
    const port = process.env.PORT || 8123
    const server = await initializeServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })
    await server.connect(transport)

  app.use(express.json());

  app.post('/mcp', (req, res) => transport.handleRequest(req, res, req.body));
  app.get('/mcp', (req, res) => transport.handleRequest(req, res, req.body));

  app.listen(port, () => {
    console.log(`MCP server running on port ${port}`);
  });
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
