import request from "@/utils/request";

export function tojoin(data) {
  return request.post("/mtJoin", data, {
    login: false,
  });
}

// 查询代理商类型
export function getAgentType() {
  return request.get(
    "/franchisee/agentType",
    {},
    {
      login: true,
    }
  );
}

// 付款成为代理商
export function becomeAgent(data) {
  return request.post("/franchisee/becomeAgent", data, {
    login: true,
  });
}
