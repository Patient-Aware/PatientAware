from flask import Flask

# create app instance
app = Flask(__name__)

# API route
@app.route('/')
def hello_world():
    return "hello, world!"

#another api route for example
@app.route('/members')
def members():
    return {"members": ["Matt", "Chris", "Ralph", "Luke"]}

if __name__ == "__main__":
    app.run(debug=True)