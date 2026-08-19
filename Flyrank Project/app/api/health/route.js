export async function GET() {
  return Response.json({
    status: "healthy",
    service: "day1-deployment-project",
    timestamp: new Date().toISOString()
  });
}
