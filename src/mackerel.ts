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
  const url = new URL(
    `/api/v0/services/${encodeURIComponent(serviceName)}/tsdb`,
    API_BASE_URL
  )
  return url.toString()
}

export function constructServiceMetricData(
  metricName: string,
  metricValue: number,
  metricTime: number
): string {
  const serviceMetricData = [
    {
      name: metricName,
      value: metricValue,
      time: metricTime
    }
  ]
  return JSON.stringify(serviceMetricData)
}

// https://mackerel.io/api-docs/entry/service-metrics#post
// use this for constructing the request body for multiple service metrics
export function constructServiceMetricDataMultiple(
  metrics: string[],
  metricTime: number
): string {
  const serviceMetricData = []

  for (const metric of metrics) {
    // split each metric by space character.
    // the metric will be defined as 'name value timestamp'
    // e.g. foo-bar.metric 1234 1670741111
    const splitted = metric.split(/\s+/)

    // if string contains three values, use each of them as the metric.
    // else if string only contains two values, treat it as name,value and use current time as metric time.
    if (splitted.length === 3) {
      serviceMetricData.push({
        name: splitted.at(0),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value: parseInt(splitted.at(1)!, 10),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        time: parseInt(splitted.at(2)!, 10)
      })
    } else if (splitted.length === 2) {
      serviceMetricData.push({
        name: splitted.at(0),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value: parseInt(splitted.at(1)!, 10),
        time: metricTime
      })
    }
  }

  return JSON.stringify(serviceMetricData)
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
    const response = await result.readBody()
    throw new Error(
      `StatusCode: ${result.message.statusCode}, Message: ${response}`
    )
  }
  return result
}

export async function postMultipleServiceMetrics(
  apiKey: string,
  serviceName: string,
  metrics: string[],
  metricTime: number
): Promise<http.HttpClientResponse> {
  const client = prepareHttpClient(apiKey)
  const endpoint = constructServiceMetricEndpoint(serviceName)
  const postData = constructServiceMetricDataMultiple(metrics, metricTime)

  core.debug(`Endpoint: ${endpoint}`)
  core.debug(`PostData: ${postData}`)

  const result = await client.post(endpoint, postData)
  if (result.message.statusCode !== 200) {
    const response = await result.readBody()
    throw new Error(
      `StatusCode: ${result.message.statusCode}, Message: ${response}`
    )
  }
  return result
}
