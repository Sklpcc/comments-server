import * as GraphQL from "graphql";
import {Node, OrderDirection, PageInfo} from "./common";

const CommentOrderField = new GraphQL.GraphQLEnumType({
    name: 'CommentOrderField',
    description: 'Properties by which comments can be ordered.',
    values: {
        ID: {value: 'id'},
        CREATED_AT: {value: 'createdAt'},
    },
});

export const CommentOrder = new GraphQL.GraphQLInputObjectType({
    name: 'CommentOrder',
    description: 'Ways in which lists of comments can be ordered upon return.',
    fields: {
        direction: {
            type: new GraphQL.GraphQLNonNull(OrderDirection),
        },
        field: {
            type: new GraphQL.GraphQLNonNull(CommentOrderField),
        },
    }
});

export const CommentNode = new GraphQL.GraphQLObjectType({
    name: 'CommentNode',
    description: '',
    interfaces: [
        Node,
    ],
    fields: {
        id: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
        },
        content: {
            type: GraphQL.GraphQLString,
        },
        createdAt: {
            type: GraphQL.GraphQLInt,
            resolve({createdAt}) {
                return new Date(createdAt).getTime() / 1000 | 0;
            },
        },
    },
});

const CommentEdge = new GraphQL.GraphQLObjectType({
    name: 'CommendtEdge',
    description: '',
    fields: {
        cursor: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
        node: {
            type: CommentNode,
        },
    },
});

export default new GraphQL.GraphQLObjectType({
    name: 'CommentConnection',
    description: '',
    fields: {
        edges: {
            type: new GraphQL.GraphQLList(CommentEdge),
        },
        nodes: {
            type: new GraphQL.GraphQLList(CommentNode),
        },
        pageInfo: {
            type: new GraphQL.GraphQLNonNull(PageInfo),
        },
        totalCount: {
            type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
        },
    }
});
