# File: images.py
# Author: Jacob Warren
# Description: image-related helper functions

import networkx as nx
import matplotlib
matplotlib.use('Agg') # Use to generate diagrams without a display
import matplotlib.pyplot as plt
from io import BytesIO
import base64

def graph_to_base64(graph, pos):
    plt.figure()
    nx.draw(graph, pos, with_labels=True, node_size=2000, node_color="skyblue", font_size=15, font_color="black", font_weight="bold")

    # convert to image
    img_buf = BytesIO()
    plt.savefig(img_buf, format='png')
    img_buf.seek(0)
    img_data = base64.b64encode(img_buf.getvalue()).decode('utf-8')
    plt.close()

    return img_data
