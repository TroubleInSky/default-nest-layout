import { applyDecorators, Get, Post, Put, Delete, Patch, Head, Options, RequestMethod } from "@nestjs/common";
import { SubscribeMessage } from "@nestjs/websockets";

export const Endpoint = (route: string, httpRequestMethod: RequestMethod = RequestMethod.POST) => {
  return applyDecorators(SubscribeMessage(route), getHttpEndpointDecorator(route, httpRequestMethod));
};

export const getHttpEndpointDecorator = (route: string, httpRequestMethod: RequestMethod): MethodDecorator => {
  switch (httpRequestMethod) {
    case RequestMethod.GET:
      return Get(route);
    case RequestMethod.POST:
      return Post(route);
    case RequestMethod.PUT:
      return Put(route);
    case RequestMethod.DELETE:
      return Delete(route);
    case RequestMethod.PATCH:
      return Patch(route);
    case RequestMethod.HEAD:
      return Head(route);
    case RequestMethod.OPTIONS:
      return Options(route);
  }
};
