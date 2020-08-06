# Wishlist API SAM
Sample serverless wishlist CRUD API powered by AWS SAM and Auth0

## Setup

### AWS SAM

#### Init

```bash
 sam init --name wishlist-api-sam \
    --runtime nodejs12.x \
    --dependency-manager npm \
    --app-template quick-start-from-scratch \
    --no-interactive
```


### Spin Up

```bash
sam validate
sam deploy --stack-name wishlist-api-sam -g

sam log -n function-id --tail
```

### Spin Down
```bash
aws cloudformation delete-stack --stack-name xyz
```

### Auth0

#### API Definition

## Development

## Test
Copy `bin/env-sample` to `bin/.env` and update according to CF output.

```bash
cd bin

./get-wishlist.sh
./post-wishlist.sh -n name -d desc -u url
./delete-wishlist -i xxxx
```
