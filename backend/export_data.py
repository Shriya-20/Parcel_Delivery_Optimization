import os
import django
import pandas as pd

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# from delivery.models import DeliveryData  # import your model

# Query all data
data = DeliveryData.objects.all().values()

# Convert to pandas DataFrame
df = pd.DataFrame(data)

# Save to CSV or use df directly
df.to_csv('delivery_dataset.csv', index=False)
print("Data exported to delivery_dataset.csv")
