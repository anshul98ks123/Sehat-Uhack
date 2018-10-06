# K-Nearest Neighbors (K-NN)

# Importing the libraries
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import sys, json
import os
import warnings

warnings.filterwarnings('ignore')

# Importing thate dataset
dataset = pd.read_csv(os.getcwd() + '/routes/sample.csv')
X = dataset.iloc[:, 0:2].values
y = dataset.iloc[:, 2].values
lines = sys.stdin.readlines()

# Since our input would only be having one line, parse our JSON data from that
lines = json.loads(lines[0])
row = [lines[0],lines[1]]
X = np.vstack([X,row])

# Feature Scaling
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X = sc.fit_transform(X)

# Splitting the dataset into the Training set and Test set
X_train = X[:-1]
y_train = y
X_test = X[-1:]

# Fitting K-NN to the Training set
from sklearn.neighbors import KNeighborsClassifier
classifier = KNeighborsClassifier(n_neighbors = 5, metric = 'minkowski', p = 2)
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_train)
print(classifier.predict(X_test)[0])
