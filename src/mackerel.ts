import * as http from '@actions/http-client'
import * as core from '@actions/core'

const API_BASE_URL = 'https://api.mackerelio.com'

export function prepareHttpClient(apiKey: string): http.HttpClient {
  const client = new http.HttpClient(
    'stefafafan/post-mackerel-metrics (https://github.com/stefafafan/post-mackerel-metrics)'
  )
  client.requestOptions = {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    }
  }
  return client
}

// https://mackerel.io/api-docs/entry/service-metrics#post
export function constructServiceMetricEndpoint(serviceName: string): string {
  return `${API_BASE_URL}/api/v0/services/${serviceName}/tsdb`
}

export function constructServiceMetricData(
  metricName: string,
  metricValue: number,
  metricTime: number
): string {
  return `[{
    name: ${metricName},
    value: ${metricValue},
    time: ${metricTime},
}]`
}

export async function postServiceMetric(
  apiKey: string,
  serviceName: string,
  metricName: string,
  metricValue: number,
  metricTime: number
): Promise<http.HttpClientResponse> {
  const client = prepareHttpClient(apiKey)
  const endpoint = constructServiceMetricEndpoint(serviceName)
  const postData = constructServiceMetricData(
    metricName,
    metricValue,
    metricTime
  )

  core.debug(`Endpoint: ${endpoint}`)
  core.debug(`PostData: ${postData}`)

  const result = await client.post(endpoint, postData)
  if (result.message.statusCode !== 200) {
    throw new Error(
      `StatusCode: ${result.message.statusCode}, Message: ${result.readBody()}`
    )
  }
  return result
}
