const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () =>( {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args){
        return axios.get(`https://modern-react-course-michaeltombor.c9users.io:8081/companies/${parentValue.id}/users`)
        .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
    name: 'User', 
    fields: () => ( {
        id: { type: GraphQLString},
        firstName: { type: GraphQLString},
        age: { type: GraphQLInt},
        company: {
          type : CompanyType,
          resolve(parentValue, args) {
            return axios.get(`https://modern-react-course-michaeltombor.c9users.io:8081/companies/${parentValue.companyId}`)
            .then(res => res.data);
          }
        }
    })
});

const RootQuery = new GraphQLObjectType ({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`https://modern-react-course-michaeltombor.c9users.io:8081/users/${args.id}`)
        //This tells axios to make the request, then return response.data
        .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        return axios.get(`https://modern-react-course-michaeltombor.c9users.io:8081/companies/${args.id}`)
        .then(res => res.data);
      } 
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation', 
  fields: {
    addUser: {
      type: UserType,
      args: { 
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios.post('https://modern-react-course-michaeltombor.c9users.io:8081/users', { firstName, age, companyId })
        .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }){
        return axios.delete(`https://modern-react-course-michaeltombor.c9users.io:8081/users/${id}`)
        .then(res => res.data);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }, 
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args){
        return axios.patch(`https://modern-react-course-michaeltombor.c9users.io:8081/users/${args.id}`, args)
        .then(res => res.data)
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
  
});