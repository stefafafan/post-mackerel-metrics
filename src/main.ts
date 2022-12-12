import * as core from '@actions/core'
import {postServiceMetric, postMultipleServiceMetrics} from './mackerel'

async function run(): Promise<void> {
  try {
    const apiKey: string = core.getInput('api-key', {required: true})
    const serviceName: string = core.getInput('service-name', {required: true})
    const metricName: string = core.getInput('metric-name', {required: false})
    const metricValue: string = core.getInput('metric-value', {required: false})
    const metrics: string[] = core.getMultilineInput('metrics', {
      required: false
    })

    if (!((metricName !== '' && metricValue !== '') || metrics.length !== 0)) {
      throw new Error(
        'Either metric-name and metric-value or metrics is required.'
      )
    }

    const currentTime = Math.floor(Date.now() / 1000)

    core.debug(
      `ServiceName: ${serviceName}, MetricName: ${metricName}, MetricValue: ${metricValue}, MetricTime: ${currentTime}`
    )
    // Print each line of metrics.
    for (const metric of metrics) {
      core.debug(`Metric: ${metric}`)
    }

    // Post values to Mackerel service metrics. If metrics has more than 1 item, treat request as posting multiple metrics at once.
    if (metrics.length > 0) {
      await postMultipleServiceMetrics(
        apiKey,
        serviceName,
        metrics,
        currentTime
      )
    } else {
      await postServiceMetric(
        apiKey,
        serviceName,
        metricName,
        parseInt(metricValue, 10),
        currentTime
      )
    }

    core.setOutput('time', currentTime)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
