import * as GraphQL from 'graphql';
import Database from './database';
import CommentConnection, {CommentNode, CommentOrder} from './connections/comments';

const Query = new GraphQL.GraphQLObjectType({
    name: 'Query',
    description: 'Entry endpoint.',
    fields: {
        comments: {
            type: CommentConnection,
            args: {
                after: {
                    type: GraphQL.GraphQLString,
                },
                before: {
                    type: GraphQL.GraphQLString,
                },
                first: {
                    type: GraphQL.GraphQLInt,
                },
                last: {
                    type: GraphQL.GraphQLInt,
                },
                orderBy: {
                    type: CommentOrder,
                }
            },
            // Based on: https://facebook.github.io/relay/graphql/connections.htm#sec-Pagination-algorithm
            // Naive in-memory implementation, needs optimization
            async resolve(_, {first, last, before, after, orderBy}) {
                const order = orderBy ? {
                    order: [
                        [orderBy.field, orderBy.direction]
                    ]
                } : {};
                
                let pageInfo = {
                    hasPreviousPage: false,
                    hasNextPage: false,
                    endCursor: null,
                    startCursor: null,
                };
                
                let nodes = await Database.models.comment.findAll(order);
                if(after != null) {
                    //noinspection EqualityComparisonWithCoercionJS
                    const index = nodes.findIndex(el => el.id == after);
                    if(index !== -1) {
                        nodes.splice(0, index + 1);
                    }
                }
                if(before != null) {
                    const index = nodes.findIndex(el => el.id == before);
                    if(index !== -1) {
                        nodes.splice(index);
                    }
                }
                
                if(first != null) {
                    if(first < 0) {
                        throw new Error('');
                    } else {
                        const count = nodes.length;
                        if(count > first) {
                            // TODO: If the server can efficiently determine that elements exist prior to after, return true.
                            nodes.splice(first);
                            pageInfo.hasNextPage = true;
                        }
                    }
                }
                
                if(last != null) {
                    if(last < 0) {
                        throw new Error('');
                    } else {
                        const count = nodes.length;
                        if(count > last) {
                            // TODO: If the server can efficiently determine that elements exist following before, return true.
                            nodes.splice(0, count - last);
                            pageInfo.hasPreviousPage = true;
                        }
                    }
                }
                
                const edges = nodes.map(el => {
                    return {
                        cursor: el.id,
                        node: el,
                    };
                });
                
                const totalCount = edges.length;
                
                pageInfo.startCursor = totalCount > 0 ? edges[0].cursor : null;
                pageInfo.endCursor = totalCount > 0 ? edges[totalCount - 1].cursor : null;
                
                return {
                    edges,
                    nodes,
                    pageInfo,
                    totalCount,
                }
            },
        }
    },
});

const Mutation = new GraphQL.GraphQLObjectType({
    name: 'Mutation',
    description: 'Queries that mutate things.',
    fields() {
        return {
            addComment: {
                type: CommentNode,
                args: {
                    content: {
                        type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
                    },
                },
                resolve(_, args) {
                    return Database.models.comment.create({
                        content: args.content,
                    });
                },
            },
            // type: Comment, based on GitHub's delete mutations return types
            deleteComment: {
                type: CommentNode,
                args: {
                    id: {
                        type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
                    },
                },
                async resolve(_, args) {
                    let model = await Database.models.comment.findById(args.id);
                    if(model) {
                        let count = await Database.models.comment.destroy({where: args});
                        if(count > 0) {
                            return model;
                        } else {
                            throw new Error('Cant delete the record.');
                        }
                    } else {
                        throw new Error('The record doesn\'t exists or has already been deleted.')
                    }
                }
            }
        }
    }
});

const Schema = new GraphQL.GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

export default Schema;
