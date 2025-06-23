#!/usr/bin/env node
import express from 'express'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import crypto from 'crypto'
import {registerAllPrompts} from './prompts/register.js'
import {registerAllResources} from './resources/register.js'
import {registerAllTools} from './tools/register.js'
import {env} from './config/env.js'
import {VERSION} from './config/version.js'

const MCP_SERVER_NAME = '@sanity/mcp-server'
const PORT = process.env.PORT || 6277

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

async function main() {
  try {
    const app = express()
    app.use(express.json())

    const server = await initializeServer()
    
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // disable session-based streaming
      enableJsonResponse: true // use regular JSON responses, not SSE
    })
    
    await server.connect(transport)
    console.log('Registered methods:', server ?? 'unknown')

    app.post('/mcp', async (req, res) => {
      await transport.handleRequest(req, res, req.body)
    })

    app.listen(PORT, () => {
      console.log(`MCP HTTP server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()