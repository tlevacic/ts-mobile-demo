import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import Config from 'react-native-config';
import { trpc, type RouterOutput, type RouterInput } from './utils/trpc';
import { useForm, Controller, type SubmitErrorHandler } from 'react-hook-form';
import { CreateUserSchema, type CreateUserType } from '@splashorg/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function UserList({ users }: { users: RouterOutput['users'] }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>Users</Text>
      {users.map((u) => {
        return (
          <View key={u.id}>
            <Text>
              {u.name} {u.lastName} - {u.nickName}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function Error({ message }: { message: unknown }) {
  // NOT A COMPLETE IMPLEMENTATION, check react-hook-form documentation on how to robustly render errors
  if (typeof message === 'string') {
    return <Text style={{ color: 'red' }}>{message}</Text>;
  }
  return null;
}

function UserForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(CreateUserSchema) });
  const queryClient = useQueryClient();

  const mutation = trpc.userCreate.useMutation({
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: [['users']] });
      reset({});
    },
  });

  const onSubmit = (data: RouterInput['userCreate']) => {
    mutation.mutate(data);
  };

  const onError: SubmitErrorHandler<CreateUserType> = (errors, _e) => {
    return console.log(errors);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontWeight: 'bold' }]}>
        Create new user
      </Text>
      <Text style={styles.label}>First name</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="name"
      />
      <Error message={errors?.name?.message} />

      <Text style={styles.label}>Last name</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="lastName"
      />
      <Error message={errors?.lastName?.message} />

      <Text style={styles.label}>Nick name</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="nickName"
      />
      <Error message={errors?.nickName?.message} />

      <View style={styles.button}>
        <Button
          color="black"
          title="Reset"
          onPress={() => {
            reset({});
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          color="black"
          title="Submit"
          onPress={handleSubmit(onSubmit, onError)}
        />
      </View>
    </View>
  );
}

function Main() {
  const users = trpc.users.useQuery();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View testID="heading">
            <Text>Hello Splash</Text>
            {users.data ? (
              <UserList users={users.data} />
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
          <UserForm />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${Config.SERVER_URL}/trpc`,
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: 'white',
    height: 40,
    backgroundColor: '#ec5990',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0e101c',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});

export default App;
