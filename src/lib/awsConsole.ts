export function getCloudFormationStacksUrl(region: string) {
  return `https://${region}.console.aws.amazon.com/cloudformation/home?region=${region}#/stacks`;
}

export function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
