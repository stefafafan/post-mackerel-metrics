import * as core from '@actions/core'
import {postServiceMetric} from './mackerel'

async function run(): Promise<void> {
  try {
    const apiKey: string = core.getInput('api-key', {required: true})
    const serviceName: string = core.getInput('service-name', {required: true})
    const metricName: string = core.getInput('metric-name', {required: true})
    const metricValue: string = core.getInput('metric-value', {required: true})

    // TODO: support metric-time input
    const currentTime = Date.now() / 1000
    // const metricTime: string = core.getInput('metric-time')

    core.debug(
      `ServiceName: ${serviceName}, MetricName: ${metricName}, MetricValue: ${metricValue}, MetricTime: ${currentTime}`
    )

    // Post values to Mackerel service metrics.
    await postServiceMetric(
      apiKey,
      serviceName,
      metricName,
      parseInt(metricValue, 10),
      currentTime
    )

    core.setOutput('time', currentTime)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
