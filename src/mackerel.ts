import * as http from '@actions/http-client'

const API_BASE_URL = 'https://api.mackerelio.com/'

export async function postServiceMetric(
  apiKey: string,
  serviceName: string,
  metricName: string,
  metricValue: number,
  metricTime: number
): Promise<http.HttpClientResponse> {
  // Setup http client.
  const client = new http.HttpClient(
    'stefafafan/post-mackerel-metrics (https://github.com/stefafafan/post-mackerel-metrics)'
  )
  client.requestOptions = {
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    }
  }

  // https://mackerel.io/api-docs/entry/service-metrics#post
  const endpoint = `${API_BASE_URL}/api/v0/services/${serviceName}/tsdb`

  // Post to Mackerel API.
  const postData = `[
    {
        name: ${metricName},
        value: ${metricValue},
        time: ${metricTime},
    }
  ]`
  const result = await client.post(endpoint, postData)

  // Throw error if not success.
  if (result.message.statusCode !== 200) {
    throw new Error(
      `StatusCode: ${result.message.statusCode}, Message: ${result.readBody()}`
    )
  }

  return result
}
